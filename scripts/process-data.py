"""
Processes xlsx source files from Downloads into JSON data files used by the Next.js site.
Run: python scripts/process-data.py
"""

import pandas as pd
import json
import re
from pathlib import Path
from collections import Counter

DOWNLOADS = Path.home() / "Downloads"
OUT = Path(__file__).parent.parent / "data"
OUT.mkdir(exist_ok=True)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def mode_val(series):
    vals = series.dropna()
    vals = vals[vals.str.strip().str.lower() != "unspecified"]
    if vals.empty:
        return None
    return Counter(vals).most_common(1)[0][0]


def parse_amenities(feat_str: str) -> list[str]:
    if not isinstance(feat_str, str):
        return []
    return [a.strip() for a in feat_str.split(",") if a.strip()]


# â”€â”€ Neighborhoods â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

df = pd.read_excel(DOWNLOADS / "GoodSubdivisions.xlsx")

# Drop rows without a subdivision name or close price
df = df[df["SubdivisionName"].notna() & df["ClosePrice"].notna()]
df = df[~df["SubdivisionName"].str.strip().str.lower().isin(["none", ""])]

# For string school columns, ensure str type
for col in ["ElementarySchool", "MiddleSchool", "HighSchool"]:
    df[col] = df[col].astype(str).replace("nan", None)

neighborhoods = []
for name, grp in df.groupby("SubdivisionName"):
    slug = slugify(name)

    # Aggregate amenities: collect all unique values across listings
    all_amenities = []
    for feat in grp["CommunityFeatures"].dropna():
        all_amenities.extend(parse_amenities(feat))
    amenity_counts = Counter(all_amenities)
    # Keep amenities present in >20% of listings or at least 2 sales
    n = len(grp)
    threshold = max(2, n * 0.2)
    top_amenities = sorted(
        [a for a, c in amenity_counts.items() if c >= threshold]
    )

    # City & zip (most common)
    city = mode_val(grp["City"].astype(str)) if "City" in grp else None
    zip_code = None
    if "PostalCode" in grp:
        zips = grp["PostalCode"].dropna()
        zip_code = str(int(zips.mode()[0])) if not zips.empty else None

    # Price stats
    prices = grp["ClosePrice"].dropna()
    dom = grp["DaysOnMarket"].dropna()

    neighborhoods.append({
        "id": slug,
        "name": name,
        "city": city,
        "zip": zip_code,
        "avgPrice": round(prices.mean()) if not prices.empty else None,
        "medianPrice": round(prices.median()) if not prices.empty else None,
        "minPrice": round(prices.min()) if not prices.empty else None,
        "maxPrice": round(prices.max()) if not prices.empty else None,
        "avgDaysOnMarket": round(dom.mean(), 1) if not dom.empty else None,
        "salesCount": len(grp),
        "elementarySchool": mode_val(grp["ElementarySchool"].astype(str)),
        "middleSchool": mode_val(grp["MiddleSchool"].astype(str)),
        "highSchool": mode_val(grp["HighSchool"].astype(str)),
        "amenities": top_amenities,
    })

# Sort by sales volume descending
neighborhoods.sort(key=lambda x: x["salesCount"], reverse=True)

with open(OUT / "neighborhoods.json", "w") as f:
    json.dump(neighborhoods, f, indent=2)
print(f"OK {len(neighborhoods)} neighborhoods written")


# â”€â”€ Schools â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

schools_df = pd.read_excel(DOWNLOADS / "Schools.xlsx")
schools = []
for _, row in schools_df.iterrows():
    schools.append({
        "id": int(row["ID"]),
        "name": str(row["School_Name"]).strip(),
        "type": str(row["School_Type"]).strip(),
        "county": str(row["School_County"]).strip(),
        "state": str(row["School_State"]).strip(),
        "slug": slugify(str(row["School_Name"])),
    })

with open(OUT / "schools.json", "w") as f:
    json.dump(schools, f, indent=2)
print(f"âœ“ {len(schools)} schools written")


# â”€â”€ Amenities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

am_df = pd.read_excel(DOWNLOADS / "Neighborhood_Amenities.xlsx")
amenities = [
    {"id": int(row["ID"]), "name": str(row["Amenity"]).strip()}
    for _, row in am_df.iterrows()
]

with open(OUT / "amenities.json", "w") as f:
    json.dump(amenities, f, indent=2)
print(f"âœ“ {len(amenities)} amenities written")


# â”€â”€ Contractors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

def read_contractors():
    xl = pd.ExcelFile(DOWNLOADS / "Contractors.xlsx")
    frames = [pd.read_excel(DOWNLOADS / "Contractors.xlsx", sheet_name=s) for s in xl.sheet_names]
    return pd.concat(frames, ignore_index=True)

con_df = read_contractors()
contractors = []
for _, row in con_df.iterrows():
    company = str(row.get("Company Name", "")).strip()
    if not company or company == "nan":
        continue
    contractors.append({
        "company": company,
        "contact": str(row.get("Name", "")).strip() if pd.notna(row.get("Name")) else None,
        "phone": str(row.get("Phone", "")).strip() if pd.notna(row.get("Phone")) else None,
        "email": str(row.get("Email", "")).strip() if pd.notna(row.get("Email")) else None,
        "service": str(row.get("Service", "")).strip() if pd.notna(row.get("Service")) else None,
        "website": str(row.get("Website", "")).strip() if pd.notna(row.get("Website")) else None,
    })

with open(OUT / "contractors.json", "w") as f:
    json.dump(contractors, f, indent=2)
print(f"âœ“ {len(contractors)} contractors written")

print("\nAll data files written to /data/")

