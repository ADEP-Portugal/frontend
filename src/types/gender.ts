export enum Gender {
  MASCULINE = "MASCULINE",
  FEMININE = "FEMININE",
}

export function getLabelGender(gender: Gender): string {
  switch(gender) {
    case Gender.MASCULINE:
      return "Masculino";
      break;
    case Gender.FEMININE:
      return "Feminino";
      break;
    default:
      return "Outro";
      break;
  }
}