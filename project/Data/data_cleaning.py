import pandas as pd
import os

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

            # Adiciona a coluna da categoria
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

    # Salva como CSV
    merged_df.to_csv("./intermediate/merged_cleaned_products.csv", index=False)
    print("Ficheiro gerado: ./intermediate/merged_cleaned_products.csv")
else:
    print("Nenhum ficheiro foi processado com sucesso.")