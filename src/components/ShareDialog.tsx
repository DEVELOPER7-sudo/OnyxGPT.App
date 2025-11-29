import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Share2,
  Copy,
  Eye,
  Lock,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  Smile,
  MoreVertical,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface ShareLink {
  id: string;
  share_token: string;
  chat_id: string;
  is_public: boolean;
  password_protected: boolean;
  password?: string;
  expires_at?: string;
  created_at: string;
  created_by: string;
  view_count: number;
}

interface MessageComment {
  id: string;
  message_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface CommentReaction {
  id: string;
  comment_id: string;
  emoji: string;
  user_id: string;
}

interface ShareDialogProps {
  chatId: string;
  chatTitle: string;
}

const ShareDialog = ({ chatId, chatTitle }: ShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('never');
  const [comments, setComments] = useState<MessageComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState<CommentReaction[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadShareLinks();
      loadComments();
    }
  }, [isOpen, chatId]);

  const loadShareLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shared_chats')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShareLinks(data || []);
    } catch (error) {
      console.error('Error loading share links:', error);
      toast.error('Failed to load share links');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('message_comments')
        .select('*')
        .eq('message_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const generateShareLink = async () => {
    try {
      setIsCreating(true);

      if (passwordProtected && !password.trim()) {
        toast.error('Password is required for password-protected shares');
        return;
      }

      const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      let expiresAt = null;
      if (expiresIn !== 'never') {
        const now = new Date();
        const days = parseInt(expiresIn);
        expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
      }

      const { data, error } = await supabase
        .from('shared_chats')
        .insert([
          {
            chat_id: chatId,
            share_token: shareToken,
            is_public: isPublic,
            password_protected: passwordProtected,
            password: passwordProtected ? password : null,
            expires_at: expiresAt,
            view_count: 0,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setShareLinks([...shareLinks, data[0]]);
        toast.success('Share link created!');
        setPassword('');
        setPasswordProtected(false);
        setIsPublic(false);
        setExpiresIn('never');
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsCreating(false);
    }
  };

  const deleteShareLink = async (shareId: string) => {
    try {
      const { error } = await supabase
        .from('shared_chats')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      setShareLinks(shareLinks.filter(s => s.id !== shareId));
      toast.success('Share link deleted');
    } catch (error) {
      console.error('Error deleting share link:', error);
      toast.error('Failed to delete share link');
    }
  };

  const copyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied to clipboard');
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('message_comments')
        .insert([
          {
            message_id: chatId,
            content: newComment,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setComments([...comments, data[0]]);
        setNewComment('');
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('message_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const addReaction = async (commentId: string, emoji: string) => {
    try {
      const { data, error } = await supabase
        .from('comment_reactions')
        .insert([
          {
            comment_id: commentId,
            emoji: emoji,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        setReactions([...reactions, data[0]]);
        toast.success('Reaction added');
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Failed to add reaction');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105"
          title="Share chat"
        >
          <Share2 className="w-3 h-3 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share "{chatTitle}"</DialogTitle>
          <DialogDescription>
            Create shareable links and collaborate with comments and reactions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="links">Share Links</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="access">Access Log</TabsTrigger>
          </TabsList>

          {/* Share Links Tab */}
          <TabsContent value="links" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create New Share Link</CardTitle>
                <CardDescription>Configure how others can access this chat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="public-toggle">Public Link</Label>
                    <Switch
                      id="public-toggle"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPublic ? 'Anyone with the link can view' : 'Link requires authentication'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-toggle">Password Protected</Label>
                    <Switch
                      id="password-toggle"
                      checked={passwordProtected}
                      onCheckedChange={setPasswordProtected}
                    />
                  </div>
                  {passwordProtected && (
                    <Input
                      type="password"
                      placeholder="Set password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-sm"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Link Expiration</Label>
                  <select
                    id="expires"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  >
                    <option value="never">Never</option>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>

                <Button
                  onClick={generateShareLink}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? 'Creating...' : 'Create Share Link'}
                </Button>
              </CardContent>
            </Card>

            {/* Active Share Links */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Active Share Links</h3>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : shareLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No share links yet</p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2 pr-4">
                    {shareLinks.map((share) => (
                      <Card key={share.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={share.is_public ? 'default' : 'outline'}>
                                <Eye className="w-3 h-3 mr-1" />
                                {share.is_public ? 'Public' : 'Private'}
                              </Badge>
                              {share.password_protected && (
                                <Badge variant="outline">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Protected
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Views: {share.view_count}
                            </p>
                            <code className="text-xs bg-muted p-2 rounded block truncate">
                              {`${window.location.origin}/share/${share.share_token}`}
                            </code>
                            {share.expires_at && (
                              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Expires: {new Date(share.expires_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => copyShareLink(share.share_token)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => deleteShareLink(share.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />
              <Button onClick={addComment} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Add Comment
              </Button>
            </div>

            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                ) : (
                  comments.map((comment) => {
                    const commentReactions = reactions.filter(r => r.comment_id === comment.id);
                    return (
                      <Card key={comment.id} className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => deleteComment(comment.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm mb-2">{comment.content}</p>
                        <div className="flex items-center gap-2">
                          {commentReactions.length > 0 && (
                            <div className="flex gap-1">
                              {[...new Set(commentReactions.map(r => r.emoji))].map((emoji) => (
                                <Badge
                                  key={emoji}
                                  variant="outline"
                                  className="text-xs cursor-pointer"
                                >
                                  {emoji}{' '}
                                  {commentReactions.filter(r => r.emoji === emoji).length}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                <Smile className="w-3 h-3 mr-1" />
                                React
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {['👍', '❤️', '😂', '🤔', '👏'].map((emoji) => (
                                <DropdownMenuItem
                                  key={emoji}
                                  onClick={() => addReaction(comment.id, emoji)}
                                >
                                  {emoji}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Access Log Tab */}
          <TabsContent value="access" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Access Log</CardTitle>
                <CardDescription>Track who has accessed this shared chat</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access logs will be tracked here. Share this chat with others to see activity.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
