import React from 'react';
import TweetRow from './TweetRow';

export default function ReportsManagement({
    reportedTweets,
    handleDeleteTweet,
    handleMarkReviewed
}) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Content Reports</h2>
            <div className="bg-gray-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Reported Tweets</h3>
                <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {reportedTweets.map(report => (
                        <TweetRow
                            key={report.id}
                            report={report}
                            onDelete={handleDeleteTweet}
                            onMarkReviewed={handleMarkReviewed}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}