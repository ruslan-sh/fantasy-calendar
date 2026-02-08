import "./css/index.css";
import { renderInput } from "./ts/render";
import { readQueryParams } from "./ts/url-utils";

const { year, month, day } = readQueryParams();
renderInput(year, month, day);
