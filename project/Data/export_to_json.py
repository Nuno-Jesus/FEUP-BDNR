import pandas as pd
import os
import json
import random

# Lista de arquivos CSV e seus nomes de categoria
categories = [
    "case", "case-accessory", "case-fan", "cpu", "cpu-cooler",
    "external-hard-drive", "fan-controller", "headphones",
    "internal-hard-drive", "keyboard", "memory", "monitor",
    "motherboard", "mouse", "OS", "power-supply", "sound-card",
    "thermal-paste", "video-card", "webcam"
]

# Pasta onde estão os CSVs
data_folder = ""  # muda se os CSVs estiverem noutra pasta

all_dataframes = []

for category in categories:
    csv_path = os.path.join(data_folder, f"{category}.csv")
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)

            df["category"] = category

            # Remove colunas e linhas completamente vazias
            df.dropna(axis=1, how="all", inplace=True)
            df.dropna(axis=0, how="all", inplace=True)

            # Limpa espaços extras em colunas string
            for col in df.select_dtypes(include=["object"]):
                df[col] = df[col].astype(str).str.strip()

            # Tenta converter colunas numéricas
            for col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="ignore")

            # Preenche preços ausentes com a média da categoria (arredondada)
            if "price" in df.columns:
                mean_price = df["price"].mean(skipna=True)  # Calcula a média ignorando valores NaN
                mean_price = round(mean_price, 2)  # Arredonda a média para 2 casas decimais
                df["price"].fillna(mean_price, inplace=True)  # Substitui NaN pela média arredondada

            all_dataframes.append(df)

        except Exception as e:
            print(f"Erro ao processar {category}: {e}")
    else:
        print(f"Arquivo não encontrado: {csv_path}")

# Junta tudo num único DataFrame
if all_dataframes:
    merged_df = pd.concat(all_dataframes, ignore_index=True)

    # Exporta para JSON com os atributos organizados
    with open("./final/products.json", "w", encoding="utf-8") as f:
        for _, row in merged_df.iterrows():
            # Remove campos com valores NaN
            row_dict = row.dropna().to_dict()

            # Campos que devem ficar fora de "attributes"
            main_fields = ["name", "price", "category"]

            # Cria o objeto principal
            clean_row = {key: row_dict[key] for key in main_fields if key in row_dict}

            # Adiciona o campo "stock" com valor aleatório entre 0 e 20
            clean_row["stock"] = random.randint(0, 20)

            # Adiciona o campo reviews como uma lista vazia
            clean_row["reviews"] = []

            # Adiciona o campo discount com valores múltiplos de 5 entre 0 e 70
            clean_row["discount"] = random.randint(0, 20) * 5 - 30
            if clean_row["discount"] < 0:
                clean_row["discount"] = 0

            # Move o restante, incluindo "type", para "attributes"
            attributes = {key: value for key, value in row_dict.items() if key not in main_fields}
            clean_row["attributes"] = attributes

            # Escreve no arquivo JSON
            json.dump(clean_row, f)
            f.write("\n")

    print("Ficheiro './final/products.json' criado com sucesso!")
else:
    print("Nenhum ficheiro foi processado com sucesso.")