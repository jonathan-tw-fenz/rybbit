import { Filter, FilterParameter, FilterType } from "@rybbit/shared";
import { getCountryName } from "../../../../../lib/utils";

export function getParameterNameLabel(parameter: FilterParameter) {
  switch (parameter) {
    case "country":
      // return "Country";
      return "国家";
    case "device_type":
      // return "Device Type";
      return "装置类型";
    case "operating_system":
      return "OS";
    case "browser":
      // return "Browser";
      return "浏览器";
    case "referrer":
      // return "Referrer";
      return "参照来源";
    case "pathname":
      // return "Path";
      return "路径";
    case "page_title":
      // return "Title";
      return "标题";
    case "querystring":
      // return "Query";
      return "Query";
    case "language":
      // return "Language";
      return "语言";
    case "city":
      // return "City";
      return "城市";
    case "region":
      // return "Region";
      return "地区";
    case "channel":
      // return "Channel";
      return "渠道";
    case "entry_page":
      // return "Entry Page";
      return "入口页";
    case "exit_page":
      // return "Exit Page";
      return "出口页";
    case "dimensions":
      // return "Dimension";
      return "维度";
    case "event_name":
      // return "Event Name";
      return "事件名";
    case "utm_source":
      // return "UTM Source";
      return "UTM来源";
    case "utm_medium":
      // return "UTM Medium";
      return "UTM媒介";
    case "utm_campaign":
      // return "UTM Campaign";
      return "UTM广告活动";
    case "utm_term":
      // return "UTM Term";
      return "UTM关键字";
    case "utm_content":
      // return "UTM Content";
      return "UTM内容";
    case "browser_version":
      // return "Browser Version";
      return "浏览器版本";
    case "operating_system_version":
      // return "OS Version";
      return "OS版本";
    case "user_id":
      // return "User ID";
      return "使用者ID";
    case "lat":
      // return "Lat";
      return "经度";
    case "lon":
      // return "Lon";
      return "纬度";
    case "hostname":
      // return "Hostname";
      return "网域名";
    case "timezone":
      // return "Timezone";
      return "时区";
    case "vpn":
      return "VPN";
    case "crawler":
      // return "Crawler";
      return "爬虫者";
    case "datacenter":
      // return "Datacenter";
      return "资料中心";
    case "company":
      // return "Company";
      return "公司";
    case "company_type":
      // return "Company Type";
      return "公司类型";
    case "company_domain":
      // return "Company Domain";
      return "公司网域";
    case "asn_org":
      // return "ASN Org";
      return "ASN团体";
    case "asn_type":
      // return "ASN Type";
      return "ASN类型";
    case "asn_domain":
      // return "ASN Domain";
      return "ASN网域";
    default:
      return parameter;
  }
}

export const filterTypeToLabel = (type: FilterType) => {
  switch (type) {
    case "equals":
      // return "is";
      return "为";
    case "not_equals":
      // return "is not";
      return "不为";
    case "contains":
      // return "contains";
      return "包含";
    case "not_contains":
      // return "not contains";
      return "不包含";
    case "regex":
      // return "matches";
      return "符合";
    case "not_regex":
      // return "not matches";
      return "不符合";
    case "greater_than":
      return ">";
    case "less_than":
      return "<";
    default:
      return type;
  }
};

export function getParameterValueLabel(filter: Filter, getRegionName: (region: string) => string | undefined) {
  const formatValue = (value: string | number) => {
    if (filter.parameter === "country") {
      return getCountryName(value as string);
    }
    if (filter.parameter === "region") {
      return getRegionName(value as string);
    }
    return value;
  };

  if (filter.value.length === 1) {
    return formatValue(filter.value[0]);
  }

  // For multiple values, format them and join with commas
  return filter.value.map(formatValue).join(", ");
}
