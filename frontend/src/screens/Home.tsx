import { axiosInstance } from "../api";
import { useEffect, useRef, useState } from "react";
import { TransactionTypeOperation } from "../constants";
import { formatTransactionValue } from "../utils";

interface TransactionType {
  type_id: number;
  description: string;
  nature: string;
  sign: string;
}

export interface TransactionData {
  transactions: {
    id: number;
    date: string;
    product: string;
    value: string;
    seller: string;
    created_at: string;
    updated_at: string;
    transaction_type: TransactionType;
  }[];
  length: number;
}

export default function Home() {
  const [transactionData, setTransactionData] = useState<TransactionData>();
  const [transactionTotal, setTransactionTotal] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmitFile() {
    const formData = new FormData();
    file && formData.append("sales", file);

    try {
      await axiosInstance.post("add-data", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      fetchTransactionData();
      resetFileInput();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data.detail);
    }
  }

  async function fetchTransactionData() {
    const { data } = await axiosInstance.get("read-data");

    setTransactionData(data);
  }

  useEffect(() => {
    function calculateTransactionTotal() {
      const total = transactionData?.transactions?.reduce(function (
        totalValue,
        obj
      ) {
        return obj.transaction_type.nature === TransactionTypeOperation.INCOME
          ? totalValue + Number(obj.value)
          : totalValue - Number(obj.value);
      },
      0);

      total && setTransactionTotal(total);
    }

    calculateTransactionTotal();
  }, [transactionData]);

  const resetFileInput = () => {
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  return (
    <div className="sm:flex-col xl:flex xl:flex-row  gap-2 p-8">
      {transactionData?.length ? (
        <div className="relative overflow-x-auto xl:w-4/6 sm:w-full h-[75vh]">
          <table
            data-testid="transaction-table"
            className="w-full text-sm text-left text-gray-500"
          >
            <thead className="sticky top-0 text-xs uppercase bg-gray-50 text-[#254A75]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3">
                  Data da Transação
                </th>
                <th scope="col" className="px-6 py-3">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3">
                  Vendedor
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipo da Transação
                </th>
                <th scope="col" className="px-6 py-3">
                  Natureza
                </th>
              </tr>
            </thead>
            <tbody className="bg-white border-b">
              {transactionData?.transactions?.map((transaction, index) => {
                return (
                  <tr key={index} data-testid="transaction-row">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {transaction.id}
                    </th>
                    <td className="px-6 py-4">{transaction.product}</td>
                    <td className="px-6 py-4">{transaction.date}</td>
                    <td className="px-6 py-4">
                      {formatTransactionValue(transaction.value)}
                    </td>
                    <td className="px-6 py-4">{transaction.seller}</td>
                    <td className="px-6 py-4">
                      {transaction.transaction_type.description}
                    </td>
                    <td
                      className={`px-6 py-4 ${
                        transaction.transaction_type.nature ===
                        TransactionTypeOperation.INCOME
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type.nature}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="relative overflow-x-auto xl:w-4/6 sm:w-full h-fit flex justify-center items-center"
          data-testid="no-transaction"
        >
          <span className="italic font-bold text-[#254A75] text-xl">
            NENHUM DADO DISPONÍVEL
          </span>
        </div>
      )}
      <div className="flex flex-col sm:w-full xl:w-2/6 p-2 gap-4">
        <div
          data-testid="total-transactions"
          className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8"
        >
          <span className="italic font-bold text-[#254A75]">
            TOTAL DAS TRANSAÇÕES REALIZADAS:
          </span>
          <span className="text-lg">
            {formatTransactionValue(transactionTotal)}
          </span>
        </div>
        <div
          data-testid="load-transaction-data"
          className="h-fit shadow-lg rounded-lg flex flex-col justify-center items-center bg-white p-8 gap-4"
        >
          <span className="italic font-bold text-[#254A75] text-xl">
            Carregar Dados
          </span>
          <input
            type="file"
            id="fileUpload"
            data-testid="file-input"
            ref={inputRef}
            onChange={(e) => {
              if (!e.target.files) return;
              setFile(e.target.files[0]);
            }}
            accept=".txt"
          />
          <button
            data-testid="submit-file"
            onClick={handleSubmitFile}
            className="h-[40px] w-[250px] bg-blue-600 hover:bg-blue-500 active:bg-blue-800 rounded-lg text-white font-bold"
          >
            Enviar Arquivo
          </button>
        </div>
      </div>
    </div>
  );
}
