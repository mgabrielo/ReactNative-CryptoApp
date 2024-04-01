import { ExpoRequest, ExpoResponse } from "expo-router/server";

const API_KEY = process.env.COIN_MARKET_API_KEY as string;

export async function GET(request: ExpoRequest) {
  const ids = request.expoUrl.searchParams.get("ids");

  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${ids}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY!,
      },
    }
  );

  const res = await response.json();
  return ExpoResponse.json(res.data);
}
