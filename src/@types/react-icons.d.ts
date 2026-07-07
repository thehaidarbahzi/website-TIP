declare module "react-icons/fa" {
  import { FC, SVGProps } from "react";
  type IconProps = SVGProps<SVGSVGElement> & { size?: string | number };

  const FaGraduationCap: FC<IconProps>;
  const FaPaintBrush: FC<IconProps>;
  const FaCalendarAlt: FC<IconProps>;
  const FaCheckCircle: FC<IconProps>;
  const FaTrophy: FC<IconProps>;
  const FaUpload: FC<IconProps>;
  const FaFlagCheckered: FC<IconProps>;
  const FaInfoCircle: FC<IconProps>;

  export {
    FaGraduationCap,
    FaPaintBrush,
    FaCalendarAlt,
    FaCheckCircle,
    FaTrophy,
    FaUpload,
    FaFlagCheckered,
    FaInfoCircle,
  };
}
