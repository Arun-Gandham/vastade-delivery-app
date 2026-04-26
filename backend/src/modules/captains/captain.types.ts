export interface CaptainRegistrationInput {
  name: string;
  mobile: string;
  password: string;
  vehicleType: "BIKE" | "CYCLE" | "AUTO" | "WALKING";
  vehicleNumber?: string;
  licenseNumber?: string;
}
