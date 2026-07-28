import React, { useMemo, useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { SSRProvider } from '@react-aria/ssr'
import { AuthProvider } from '../context/AuthContext'
import { SessionProvider } from 'next-auth/react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import '@solana/wallet-adapter-react-ui/styles.css'
import NavbarComponent from '../components/Navbar'
import Footer from '../components/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { mixpanel } from '../lib/utils/mixpanel'
import '../i18n'

export const event = (event_name, props) => {
  if (typeof window !== 'undefined' && mixpanel && typeof mixpanel.track === 'function') {
    mixpanel.track(event_name, props)
  }
}

function MyApp({ Component, pageProps }) {
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), [network])
  const wallets = useMemo(
    () => (typeof window !== 'undefined' ? [new PhantomWalletAdapter(), new SolflareWalletAdapter()] : []),
    [network]
  )

  const router = useRouter()

  const { i18n, t } = useTranslation()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lang = new URLSearchParams(window.location.search).get('lang')
      if (lang) {
        i18n.changeLanguage(lang)
      }
    }
  }, [router.query.lang]) // Depend on router.query.lang to react to changes

  useEffect(() => {
    const handleRouteChange = (url) => {
      event('Page view', { url })
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const cookieText =
    'Ao clicar em aceitar, você consente com o uso dos cookies que você proveu em nosso website, para fornecer uma melhor experiência de usuário.'

  const lightTheme = createTheme({
    type: 'light',
    theme: {
      colors: {
        background: '#D8D8D8',
        text: '#010101',
        primary: '#56F569',
        primarySolidBg: '#56F569',
        primarySolidHover: '#42C851',
      },
    },
  })
  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      colors: {
        background: '#010101',
        text: '#D8D8D8',
        primary: '#56F569',
        primarySolidBg: '#56F569',
        primarySolidHover: '#42C851',
      },
    },
  })
  return (
    <SSRProvider>
      <NextThemesProvider
        defaultTheme="dark"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
        enableSystem={true}
        disableTransitionOnChange
      >
        <NextUIProvider>
          <AuthProvider>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <SessionProvider session={pageProps.session}>
                    <Head>
                      <title>{t('createFirstProject')}</title>
                      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                      <link rel="icon" href="/assets/img/w3d-logo-symbol-ac.svg" />
                    </Head>
                    <NavbarComponent />
                    <Component {...pageProps} />
                    <Footer />
                    <ToastContainer />
                  </SessionProvider>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </AuthProvider>
        </NextUIProvider>
      </NextThemesProvider>
    </SSRProvider>
  )
}

export default MyApp
