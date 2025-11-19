declare module "react-date-range" {
  export interface Range {
    startDate: Date;
    endDate: Date;
    key?: string;
  }

  export interface DateRangeProps {
    ranges: Range[];
    onChange: (ranges: { selection: Range }) => void;
    moveRangeOnFirstSelection?: boolean;
    months?: number;
    direction?: "vertical" | "horizontal";
    showMonthAndYearPickers?: boolean;
  }

  export const DateRange: React.FC<DateRangeProps>;
}
