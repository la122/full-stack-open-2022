import { FC } from "react";
import {
  assertNever,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from "../types";
import FavoriteIcon from "@material-ui/icons/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const HealthCheckEntryDetails: FC<{ entry: HealthCheckEntry }> = ({
  entry,
}) => {
  let color: string;

  switch (entry.healthCheckRating) {
    case HealthCheckRating.Healthy:
      color = "green";
      break;
    case HealthCheckRating.LowRisk:
      color = "gold";
      break;
    case HealthCheckRating.HighRisk:
      color = "orange";
      break;
    case HealthCheckRating.CriticalRisk:
      color = "red";
      break;
    default:
      return assertNever(entry.healthCheckRating);
  }

  return (
    <div>
      {entry.date} <FactCheckIcon />
      <p>
        <i>{entry.description}</i>
      </p>
      <FavoriteIcon style={{ color }} />
    </div>
  );
};

const HospitalDetails: FC<{ entry: HospitalEntry }> = ({ entry }) => (
  <div>
    {entry.date} <LocalHospitalIcon />
    <div>
      <i>{entry.description}</i>
    </div>
    discharged on {entry.discharge.date}: <i> {entry.discharge.criteria}</i>
  </div>
);

const OccupationalHealthcareDetails: FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => (
  <div>
    {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
    <div>
      <i>{entry.description}</i>
    </div>
    {entry.sickLeave && (
      <div>
        <CalendarMonthIcon /> sick from <b>{entry.sickLeave.startDate}</b> to{" "}
        <b>{entry.sickLeave.endDate}</b>
      </div>
    )}
  </div>
);

const EntryDetails: FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    case "Hospital":
      return <HospitalDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
