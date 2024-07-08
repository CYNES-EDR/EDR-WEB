import { NextRequest, NextResponse } from "next/server";
import { customAxiosPost } from "@/helpers/custom-axios";
import { API_BACKEND } from "@/helpers/api-url";
function getDatesOfWeek() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - currentDay);
  const datesOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const formattedDate = formatDate(date);
    datesOfWeek.push(formattedDate);
  }

  return datesOfWeek;
}
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // const hours = String(date.getHours()).padStart(2, "0");
  // const minutes = String(date.getMinutes()).padStart(2, "0");
  // const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function queryByDay(
  startDate: string,
  url: string,
  alertLevel: string,
  token: string
) {
  //filter record by day with level
  const filter = {
    filter: [
      {
        field: "created_at",
        operator: ">",
        value: startDate,
      },
      {
        field: "alert_level",
        operator: "=", // operation in sql . ex: event_info->>'name' like '%auto%'
        value: alertLevel, //1-low, 2- medium, 3 - hight, 4-critical
      },
    ],
  };

  try {
    const res: { count: number; error: boolean; msg: string | null } =
      await customAxiosPost(url, filter, token);

    return res;
  } catch (error: any) {
    return { count: 0, error: true, msg: error.message };
  }
}

export async function POST(request: NextRequest) {
  let token = request.cookies.get("token")?.value || "";
  const url = API_BACKEND.DASHBOARD.GET_ALERT_COUNT;
  //-- list days of week in this week
  let listDays = getDatesOfWeek();
  let lv1OnWeek: number[] = [];
  let lv2OnWeek: number[] = [];
  let lv3OnWeek: number[] = [];
  try {
    for (const element of listDays) {
      let lv1 = await queryByDay(element, url, "1", token);
      let lv2 = await queryByDay(element, url, "2", token);
      let lv3 = await queryByDay(element, url, "3", token);
      !lv1.error && lv1OnWeek.push(lv1.count);
      !lv2.error && lv2OnWeek.push(lv1.count);
      !lv3.error && lv3OnWeek.push(lv1.count);
    }

    return NextResponse.json(
      {
        data: [
          {
            name: "Low",
            data: lv1OnWeek,
          },
          {
            name: "Medium",
            data: lv2OnWeek,
          },
          {
            name: "High",
            data: lv3OnWeek,
          },
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
