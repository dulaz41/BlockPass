import fs from 'fs';
import { join } from 'path';

const eventsDirectory = join(process.cwd(), 'mockEvents.json');

export function getAllEvents() {
  return fs.readFileSync(eventsDirectory);
}
export function getSingleEvent(id: any) {
  let dataArr: any = fs.readFileSync(eventsDirectory, 'utf8');
  let data = JSON.parse(dataArr);
  let event = data.filter((e: any) => e.id === id);

  return JSON.stringify(event);
}
export function saveDataToMockFile(data: any) {
  let dataArr: any = fs.readFileSync(eventsDirectory, 'utf8');
  let oldData = JSON.parse(dataArr);
  oldData.push(data)
  fs.writeFileSync(eventsDirectory, JSON.stringify(oldData))

  return 'saved'
}
