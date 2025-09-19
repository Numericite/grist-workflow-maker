/** biome-ignore-all lint/correctness/useExhaustiveDependencies: d */
import { fr } from "@codegouvfr/react-dsfr";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Header, type HeaderProps } from "@codegouvfr/react-dsfr/Header";
import { createNextDsfrIntegrationApi } from "@codegouvfr/react-dsfr/next-pagesdir";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { createEmotionSsrAdvancedApproach } from "tss-react/next/pagesDir";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { authClient } from "~/utils/auth-client";
import Head from "next/head";
import { Toaster } from "sonner";

// Only in TypeScript projects
declare module "@codegouvfr/react-dsfr/next-pagesdir" {
	interface RegisterLink {
		Link: typeof Link;
	}
}

const { augmentDocumentWithEmotionCache, withAppEmotionCache } =
	createEmotionSsrAdvancedApproach({ key: "css" });

const { withDsfr, dsfrDocumentApi } = createNextDsfrIntegrationApi({
	defaultColorScheme: "system",
	Link,
	preloadFonts: [
		//"Marianne-Light",
		//"Marianne-Light_Italic",
		"Marianne-Regular",
		//"Marianne-Regular_Italic",
		"Marianne-Medium",
		//"Marianne-Medium_Italic",
		"Marianne-Bold",
		//"Marianne-Bold_Italic",
		//"Spectral-Regular",
		//"Spectral-ExtraBold"
	],
});

export { augmentDocumentWithEmotionCache, dsfrDocumentApi };

const userNavigationItems: MainNavigationProps.Item[] = [
	{ text: "test", linkProps: { href: "/dashboard/test" } },
];

function App({ Component, pageProps }: AppProps) {
	const router = useRouter();

	const session = authClient.useSession();

	const isAuthenticated = !!session.data?.user;

	const logout = async () => {
		await authClient.signOut();
		router.push("/");
	};

	const navigationItems = useMemo(() => {
		if (session.isPending) return [];

		if (!isAuthenticated) return [];

		return userNavigationItems.map((item) => ({
			...item,
			isActive:
				router.asPath === item?.linkProps?.href ||
				router.asPath.startsWith(
					typeof item?.linkProps?.href === "string"
						? item?.linkProps?.href
						: "",
				),
		}));
	}, [session.isPending, session.data?.user, router.asPath, isAuthenticated]);

	const quickAccessItems = useMemo(() => {
		const items = [] as HeaderProps.QuickAccessItem[];
		if (session.isPending) return [];

		if (isAuthenticated) {
			items.push({
				iconId: "ri-logout-box-line",
				text: "Se déconnecter",
				linkProps: {
					href: "/",
					onClick: logout,
					style: { color: fr.colors.decisions.text.default.error.default },
				},
			});
		}

		return items;
	}, [session.isPending, session.data?.user, isAuthenticated]);

	return (
		<>
			<Head>
				<title>Grist Workflow Maker</title>
			</Head>
			<Toaster position="top-center" richColors />
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Header
					brandTop={
						<>
							RÉPUBLIQUE
							<br />
							FRANÇAISE
						</>
					}
					homeLinkProps={{
						href: !isAuthenticated ? "/" : "/dashboard",
						title:
							"Accueil - Nom de l’entité (ministère, secrétariat d'état, gouvernement)",
					}}
					navigation={navigationItems}
					quickAccessItems={quickAccessItems}
					serviceTitle="Grist Workflow Maker"
				/>
				<main className={fr.cx("fr-container")} style={{ flex: 1 }}>
					<Component {...pageProps} />
				</main>
				<Footer
					accessibility="non compliant"
					bottomItems={[headerFooterDisplayItem]}
				/>
			</div>
		</>
	);
}

export default withDsfr(api.withTRPC(withAppEmotionCache(App)));
