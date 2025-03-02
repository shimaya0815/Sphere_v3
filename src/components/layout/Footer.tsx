import { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center md:flex-row md:justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-500">
              &copy; {currentYear} Sphere. All rights reserved.
            </span>
          </div>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  利用規約
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;