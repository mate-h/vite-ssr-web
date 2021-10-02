import lookup from '../gen/symbols';
import { classes } from './classes';

type Props = {
  name: keyof typeof lookup;
  style?: string;
  class?: string;
};
export function Icon({name, class: c, style}: Props) {
  return /*html*/`
    <i style="${style}" class="${classes("icon", c)}">${lookup[name]}</i>
  `;
}