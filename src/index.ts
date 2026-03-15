import "./scss/index.scss";
import { renderInput } from "./ts/render";
import { readDateFromUrl } from "./ts/url-utils";

const { year, month, day } = readDateFromUrl();
renderInput(year, month, day);
