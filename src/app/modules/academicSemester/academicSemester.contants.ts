import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TMonths,
} from './academicSemester.interface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// academic semester name
export const AcademicSemesterName: TAcademicSemesterName[] = ['Autumn', 'Summer', 'Fall'];
// academic semester code
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];
// academic semster name code mapper
export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
export const AcademicSemesterSearchableFields = ['name', 'year'];
