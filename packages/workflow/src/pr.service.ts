import axios from "axios";
import { GitRemoteConfig } from "@letscode-dev-friendly/shared";

class PullRequestService {
    async createDraftPR(repoSlug: string, title: string, branchName: string, description: string) {
        try {
            const url = `${GitRemoteConfig.remote_base_url}/${repoSlug}/pullrequests`;
            const response = await axios.post(url, {
                title,
                source: {
                    branch: {
                        name: branchName,
                    },
                },
                description,
                draft: true,
            }, {
                auth: {
                    username: GitRemoteConfig.username,
                    password: GitRemoteConfig.password,
                },
            });
            return response.data;
        } catch (e) {
            throw e;
        }
    }
}

export default PullRequestService;