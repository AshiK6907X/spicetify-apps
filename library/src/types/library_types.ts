import type CollectionsWrapper from "../extensions/collections_wrapper";
import type FolderImageWrapper from "../extensions/folder_image_wrapper";

declare global {
	var SpicetifyLibrary: any;
	var CollectionsWrapper: CollectionsWrapper;
	var FolderImageWrapper: FolderImageWrapper;
}

export interface Config {
	"card-size": number;
	"extended-search": boolean;
	localAlbums: boolean;
	includeLikedSongs: boolean;
	includeLocalFiles: boolean;
	"show-artists": boolean;
	"show-albums": boolean;
	"show-playlists": boolean;
	"show-shows": boolean;
	"show-collections": boolean;
}

export interface ConfigWrapper {
	config: Config;
	launchModal: () => void;
}
