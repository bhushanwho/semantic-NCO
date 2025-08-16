import requests
from bs4 import BeautifulSoup
import csv

url = "https://dge.gov.in/dge/nat"
all_data = []

for page in range(0, 7):
    params = {
        "field_group_nat_target_id": "All",
        "field_occupation_nat_code_value": "",
        "page": page
    }
    response = requests.get(url, params=params)
    soup = BeautifulSoup(response.text, "html.parser")
    
    rows = soup.select("table tbody tr")
    if not rows:
        print(f"No data found on page {page}, stopping.")
        break

    for row in rows:
        cols = [td.get_text(strip=True) for td in row.find_all("td")]
        all_data.append(cols)

# Save all data to CSV
with open("nco_data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow(["sno", "occupation_title", "nco_2015", "nco_2004", "division", "subdivision", "group", "family"])
    writer.writerows(all_data)

print(f"Saved {len(all_data)} rows to nco_data.csv")
