import pandas as pd
import json

pdf = pd.read_csv("https://raw.githubusercontent.com/datasets/covid-19/master/data/countries-aggregated.csv")

pdf2 = pdf.sort_values(["Confirmed"], ascending=False).groupby("Date").head(20)
pdf2 = pdf2.sort_values(["Date", "Confirmed"], ascending = [True, False])
pdf2.to_csv("test.csv", index=False)


#Convert panda dataframe to json object
def tojson(df):
    d = [
        dict([
            (colname, row[i+1])
            for i,colname in enumerate(["Country","Confirmed"])
        ])
        for row in df.values
    ]
    return d

out = tojson(pdf2)


json_dict = pdf2.groupby(['Date']).apply(tojson).groupby(level=0).apply(lambda x: x).to_dict()
print(json_dict)
with open('top_20_confirmed.json', 'w') as json_file:
  json.dump(json_dict, json_file)