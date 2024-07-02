import React from "react";
import useDropdownMenu from "@shared/dropdown/useDropdownMenu";
import SpotifyCard from "@shared/components/spotify_card";
import TrackRow from "../components/track_row";
import Tracklist from "../components/tracklist";
import PageContainer from "@shared/components/page_container";
import type {
	Config,
	ConfigWrapper,
	LastFMMinifiedArtist,
	LastFMMinifiedTrack,
	SpotifyMinifiedArtist,
	SpotifyMinifiedTrack,
} from "../types/stats_types";
import * as lastFM from "../api/lastfm";
import RefreshButton from "../components/buttons/refresh_button";
import SettingsButton from "@shared/components/settings_button";
import { convertArtist, convertTrack } from "../utils/converter";
import useStatus from "@shared/status/useStatus";
import { useQuery } from "../utils/react_query";
import _ from "lodash";

const DropdownOptions = [
	{ id: "artists", name: "Top Artists" },
	{ id: "tracks", name: "Top Tracks" },
];

const getChart = async (type: "tracks" | "artists", config: Config) => {
	const { "api-key": key } = config;
	if (!key) throw new Error("Missing LastFM API Key or Username");
	if (type === "artists") {
		const response = await lastFM.getArtistChart(key);
		return Promise.all(response.map(convertArtist));
	}
	const response = await lastFM.getTrackChart(key);
	return Promise.all(response.map(convertTrack));
};

const ArtistChart = ({ artists }: { artists: (LastFMMinifiedArtist | SpotifyMinifiedArtist)[] }) => {
	return (
		<div className={"main-gridContainer-gridContainer grid"}>
			{artists.map((artist, index) => {
				return (
					<SpotifyCard
						type={"artist"}
						provider={artist.type}
						uri={artist.uri}
						header={artist.name}
						subheader={artist.playcount ? `\u29BE ${artist.playcount} Scrobbles` : "Artist"}
						imageUrl={artist.image}
						badge={`${index + 1}`}
					/>
				);
			})}
		</div>
	);
};

const TrackChart = ({ tracks }: { tracks: (LastFMMinifiedTrack | SpotifyMinifiedTrack)[] }) => {
	return (
		<Tracklist playcount>
			{tracks.map((track, index) => (
				<TrackRow index={index + 1} {...track} uris={tracks.map((track) => track.uri)} />
			))}
		</Tracklist>
	);
};

const getDate = () => {
	return new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

const ChartsPage = ({ configWrapper }: { configWrapper: ConfigWrapper }) => {
	const [dropdown, activeOption] = useDropdownMenu(DropdownOptions, "stats:charts");

	const { status, error, data, refetch } = useQuery({
		queryKey: ["top-tracks", activeOption.id],
		queryFn: () => getChart(activeOption.id as "tracks" | "artists", configWrapper.config),
	});

	const Status = useStatus(status, error);

	const props = {
		title: `Top Charts - ${_.startCase(activeOption.id)}`,
		headerEls: [dropdown, <RefreshButton callback={refetch} />, <SettingsButton configWrapper={configWrapper} />],
	};

	if (Status) return <PageContainer {...props}>{Status}</PageContainer>;

	const items = data as NonNullable<typeof data>;

	const infoToCreatePlaylist = {
		playlistName: `Top Track Chart - ${getDate()}`,
		itemsUris: items.map((track) => track.uri),
	};

	if (activeOption.id === "tracks") {
		// @ts-ignore
		props.infoToCreatePlaylist = infoToCreatePlaylist;
	}

	// @ts-ignore
	const chartToRender = activeOption.id === "artists" ? <ArtistChart artists={items} /> : <TrackChart tracks={items} />;

	return <PageContainer {...props}>{chartToRender}</PageContainer>;
};

export default React.memo(ChartsPage);
