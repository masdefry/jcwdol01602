import Link from 'next/link';

function JobCard({ job }) {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h2 className="text-lg font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600">{job.description}</p>
      <Link href={`/jobs/${job.id}`}>
        <a className="text-blue-500 hover:underline">Lihat Detail</a>
      </Link>
    </div>
  );
}

export default JobCard;
