import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Card = ({
  icon,
  title,
  description,
  className,
}: {
  icon: IconDefinition;
  title: string;
  description: string;
  className?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4 ${className}`}
    >
      <div className="size-12 rounded-xl bg-purple-100 flex items-center justify-center">
        <FontAwesomeIcon icon={icon} className="text-purple-600 text-xl p-2" />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
};

