import json

with open("./regions.geojson", 'r', encoding='utf-8') as f:
    data = json.load(f)

print(data["type"])

converted = {}

converted["type"] = data["type"]
converted["features"] = data["features"]


with open("./converted.geojson", 'w', encoding='utf-8') as f:
    json.dump(converted, f, ensure_ascii=False)

