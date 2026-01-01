import axios from "axios";

export async function checkUrlSecurity(url) {
  try {
    const response = await axios.post(
      "/api/check-url",
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
