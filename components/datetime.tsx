'use client';

interface Props {
  date?: Date;
  time?: Date;
  datetime?: Date;
  options?: Intl.DateTimeFormatOptions;
}

export default function DateTime(props: Props) {
  if (props.date) {
    return <>{props.date.toLocaleDateString(undefined, props.options)}</>;
  } else if (props.time) {
    return <>{props.time.toLocaleTimeString(undefined, props.options)}</>;
  } else if (props.datetime) {
    return <>{props.datetime.toLocaleString(undefined, props.options)}</>;
  }
}
