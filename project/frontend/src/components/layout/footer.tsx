import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const footeras = [
    {
      title: 'Products',
      href: 'products',
    },
  ];

  return (
      <footer className="bg-muted w-full mt-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 flex flex-col justify-start items-center">

            <ul className="mt-6 flex items-center gap-4 flex-wrap">
              {footeras.map(({ title, href }) => (
                <li key={title}>
                  <a
                    href={href}
                    className="text-muted-foreground hover:text-foreground font-medium"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            {/* Copyright */}
            <span className="text-muted-foreground">
              &copy;
              {new Date().getFullYear()}
              {' '}
              <a href="/" target="_blank">
                Computer Components Club
              </a>
              . All rights reserved.
            </span>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
