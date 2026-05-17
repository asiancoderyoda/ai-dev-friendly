import axios from "axios";
import { GitRemoteConfig } from "@letscode-dev-friendly/shared";
import { ReviewResult } from "@letscode-dev-friendly/agents";

class PullRequestService {
    async createDraftPR(repoSlug: string, title: string, branchName: string, review: ReviewResult): Promise<any> {
        try {
            const url = `${GitRemoteConfig.remote_base_url}/${repoSlug}/pullrequests`;

            const markdownDescription = `
                ## Automated Codebase Patch Summary
                ${review.summary}

                ### Automated Quality Metrics
                - **Risk Assessment Level**: \`${review.riskAssessment.toUpperCase()}\`
                - **Pipeline Gate Status**: \`${review.approvalRecommendation.toUpperCase()}\`

                ${review.missingTestCases.length > 0 ? `### 🧪 Omitted Testing Vectors Found\n${review.missingTestCases.map(tc => `- ${tc}`).join('\n')}` : ''}

                ### Structural Enhancements Added
                ${review.actionableFeedback.map(fb => `- ${fb}`).join('\n')}

                ---
                *Generated autonomously by LetsCode Dev-Friendly Agent Engine.*
            `;

            const response = await axios.post(url, {
                title,
                source: {
                    branch: {
                        name: branchName,
                    },
                },
                description: markdownDescription.trim(),
                draft: true,
            }, {
                auth: {
                    username: GitRemoteConfig.username,
                    password: GitRemoteConfig.password,
                },
            });

            return response.data;
        } catch (e: any) {
            console.error("[PR Service] Failed to register draft PR payload entry point:", e.response?.data || e.message);
            throw e;
        }
    }
}

export default PullRequestService;