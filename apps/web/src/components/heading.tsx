interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="pb-2">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};
