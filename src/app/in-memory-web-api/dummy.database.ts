import { formatDate } from "@angular/common";

const currentDate = formatDate(new Date(), 'dd-MM', 'en-US');

export const dummyRecords = [
  {
    "date": "02-04",
    "time": "11:00",
    "text": "Try to get up erlier.",
    "id": 11
  },
  {
    "date": "02-04",
    "time": "22:05",
    "text": "Breakfast.",
    "id": 12
  },
  {
    "date": "02-04",
    "time": "12:30",
    "text": "Coffee for one",
    "id": 13
  },
  {
    "date": "02-04",
    "time": "18:45",
    "text": "Again coffee.",
    "id": 15
  },
  {
    "date": "02-04",
    "time": "21:05",
    "text": "Dinner.",
    "id": 17
  },
  {
    "date": "02-04",
    "time": "23:10",
    "text": "Go to sleep, I gues. Joking of course.",
    "id": 18
  },
  {
    "date": "02-04",
    "time": "23:59",
    "text": "Still not going to sleep, so ckick to next page.",
    "id": 19
  }
]
.map( rec => {
  const cpy = {...rec};
  cpy.date = currentDate;
  return cpy;
})