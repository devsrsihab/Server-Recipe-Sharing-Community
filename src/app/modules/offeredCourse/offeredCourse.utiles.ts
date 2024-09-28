import { TShedule } from './offeredCourse.interface';

export const hasTimeConflict = (assginedShedules: TShedule[], newShedule: TShedule) => {

  for (const shedule of assginedShedules) {
    const existingStartTime = new Date(`1970-01-01T${shedule.starTime}`);
    const existingEndTime = new Date(`1970-01-01T${shedule.starTime}`);

    const newStartTime = new Date(`1970-01-01T${newShedule.starTime}`);
    const newEndTime = new Date(`1970-01-01T${newShedule.starTime}`);

    if (newStartTime < existingStartTime && newEndTime > existingEndTime) {
      return true;
    }
  }

  return false;
};
