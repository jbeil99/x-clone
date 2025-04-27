import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share, Copy, Twitter, Facebook, Mail } from 'lucide-react';

export default function ShareButton({ tweet }) {
    return (<Dialog>
        <DialogTrigger asChild>
            <div className="hover:text-blue-500 cursor-pointer">
                <Share className="w-4 h-4" />
            </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Share this Tweet</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
                <div className="grid flex-1 gap-2">
                    <Input
                        id="link"
                        defaultValue={`https://twitter.com/${tweet.user}/status/123456789`}
                        readOnly
                        className="w-full"
                    />
                </div>
                <Button type="submit" size="sm" className="px-3">
                    <span className="sr-only">Copy</span>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" size="sm" className="rounded-full p-3">
                    <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full p-3">
                    <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="sm" className="rounded-full p-3">
                    <Mail className="h-5 w-5" />
                </Button>
            </div>
        </DialogContent>
    </Dialog>)
}