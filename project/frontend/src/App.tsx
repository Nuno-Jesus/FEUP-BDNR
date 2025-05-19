import Layout from './components/layout/layout';
import { ThemeProvider } from './components/theme/theme-provider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout />
    </ThemeProvider>
  );
}
