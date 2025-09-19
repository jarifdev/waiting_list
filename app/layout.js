export const metadata = {
	title: 'Waiting List Ecommerce',
	description: 'Pre-launch intake for ecommerce platform',
};

import './globals.css';
import { LangProvider } from '../components/LangProvider';
import Header from '../components/Header';

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<div className="container">
					<LangProvider>
						<Header />
						{children}
					</LangProvider>
				</div>
			</body>
		</html>
	);
}

