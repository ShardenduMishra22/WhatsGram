import { Github, Linkedin, Code2 } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">TO-DO List Project</h2>
            <p className="text-sm opacity-75">Using context for efficient state management</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Made with ❤️ by</p>
            <p className="text-xl font-bold">Shardendu Mishra</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm opacity-75 mb-2">© {year} ShardenduMishra Creates</p>
            <div className="flex justify-center md:justify-end space-x-4">
              <a href="https://github.com/MishraShardendu22" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition-colors duration-300">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/shardendumishra22/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition-colors duration-300">
                <Linkedin size={24} />
              </a>
              <a href="https://leetcode.com/u/ShardenduMishra22/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-200 transition-colors duration-300">
                <Code2 size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}