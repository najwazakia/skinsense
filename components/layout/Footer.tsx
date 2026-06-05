import Link from 'next/link';
import { Mail, Shield } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'Deteksi Kulit' },
  { href: '/result', label: 'Hasil Deteksi' },
  { href: '/forum', label: 'Forum Diskusi' },
]

export default function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-green-800">

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {/* <Image src="/green-skin-sense.png" alt="SkinSense" width={48} height={48} className="rounded" /> */}
              <span className="font-zain text-xl font-extrabold text-white">SkinSense</span>
            </div>
            <p className="text-sm text-green-300 leading-relaxed">
              Platform deteksi penyakit kulit berbasis AI yang membantu kamu mengenali kondisi
              kulit dan memberikan rekomendasi penanganan yang tepat.
            </p>
          </div>

          {/* list link footer */}
          <div>
            <h4 className="font-zain font-bold text-white mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-green-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-zain font-bold text-white mb-3">Informasi</h4>
            <ul className="space-y-2 text-sm text-green-300">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500 shrink-0" />
                Hasil deteksi bukan pengganti diagnosis dokter
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                support@skinsense.id
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-green-400">
          <p>© {new Date().getFullYear()} SkinSense</p>
          <p className="flex items-center gap-1">
            v 1.0.0
          </p>
        </div>
      </div>
    </footer>
  );
}