import {
  Mail,
  Archive,
  Disc3,
  AudioLines,
  Compass,
  Gift,
  Truck,
  PackageCheck,
  Warehouse,
  MapPin,
  Heart,
  Sparkles,
  Gamepad2,
  Vibrate,
  Hand,
  Trophy,
  Medal,
  Play,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Mail,
  Archive,
  Disc3,
  AudioLines,
  Compass,
  Gift,
  Truck,
  PackageCheck,
  Warehouse,
  MapPin,
  Heart,
  Sparkles,
  Gamepad2,
  Vibrate,
  Hand,
  Trophy,
  Medal,
  Play,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}
