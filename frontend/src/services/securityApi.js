import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function checkUrlSecurity(url) {
  try {
    const response = await axios.post(
      `${API_URL}/api/check-url`,
      { url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao consultar backend:", error);

    return {
      success: false,
      error: "Erro ao verificar o site.",
    };
  }
}
