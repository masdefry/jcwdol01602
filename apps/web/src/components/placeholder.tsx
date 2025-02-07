import Image from 'next/image';
import Link from 'next/link';

export default function PlaceHolder() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{' '}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>

      {/* Additional Content */}
      <div className="bg-gray-200 p-8 my-8 rounded-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Random Content Section</h2>
        <p className="text-lg text-gray-800 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce convallis auctor sollicitudin. Nunc id euismod nulla. Sed venenatis justo et felis sollicitudin, sit amet gravida arcu ultricies.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          Phasellus ac felis ut ligula interdum varius. Integer et sapien ac ante cursus scelerisque vel ac magna. Nulla facilisi. Suspendisse malesuada feugiat libero, non laoreet felis auctor id.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          Nam ultricies, tortor ac tincidunt euismod, enim ligula gravida tortor, a faucibus elit leo eget magna. Proin imperdiet, sem ac tempus dignissim, magna velit accumsan tortor, at auctor metus elit vel ex.
        </p>
        <p className="text-lg text-gray-800">
          Curabitur id felis risus. Nulla vel odio nec lectus auctor laoreet non eget orci. Ut ultricies sem ac mauris suscipit, vel dignissim elit elementum.
        </p>
      </div>

      <div className="bg-gray-200 p-8 my-8 rounded-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Another Random Section</h2>
        <p className="text-lg text-gray-800 mb-4">
          Morbi dictum, odio eget feugiat consectetur, arcu ante tristique libero, in varius elit erat id turpis. Integer sit amet vestibulum erat, ac aliquam purus. Donec sagittis interdum sapien.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          Sed sit amet urna in enim gravida malesuada. Donec feugiat placerat ante, non aliquam purus mollis non. Suspendisse euismod augue justo, sit amet lobortis risus pretium non.
        </p>
        <p className="text-lg text-gray-800 mb-4">
          Integer convallis diam nisl, sit amet feugiat sem congue et. Cras id auctor felis. Etiam in ligula eu eros sodales pretium. Nunc pretium ex vel nisi feugiat, ac tempor risus feugiat.
        </p>
        <p className="text-lg text-gray-800">
          Fusce tempor dui nec lectus vehicula, at lacinia leo maximus. Morbi pellentesque dui felis, at pretium augue scelerisque at. Quisque faucibus vitae ex id posuere.
        </p>
      </div>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>

      <div className="flex flex-col items-center justify-center py-8 bg-gray-100 text-gray-800">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link legacyBehavior href="/">
          <a className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">
            Go back to Homepage
          </a>
        </Link>
      </div>
    </div>
  );
}
