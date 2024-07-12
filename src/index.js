import "./css/index.css";
import { renderInput } from "./js/render";
import { readQueryParams } from "./ts/url-utils";

const { year, month, day } = readQueryParams();
renderInput(year, month, day);
