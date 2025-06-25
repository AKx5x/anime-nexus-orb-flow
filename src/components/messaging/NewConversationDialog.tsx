
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: () => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({ 
  open, 
  onOpenChange, 
  onConversationCreated 
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && searchTerm) {
      searchUsers();
    }
  }, [searchTerm, open]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user?.id)
      .or(`username.ilike.%${searchTerm}%,display_name.ilike.%${searchTerm}%`)
      .limit(10);

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const startConversation = async (targetUser: any) => {
    if (!user) return;

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_one_id.eq.${user.id},participant_two_id.eq.${targetUser.id}),and(participant_one_id.eq.${targetUser.id},participant_two_id.eq.${user.id})`)
      .single();

    if (existingConversation) {
      toast.info('Conversation already exists');
      onOpenChange(false);
      onConversationCreated();
      return;
    }

    // Create new conversation
    const { error } = await supabase
      .from('conversations')
      .insert({
        participant_one_id: user.id,
        participant_two_id: targetUser.id
      });

    if (error) {
      toast.error('Failed to start conversation');
    } else {
      toast.success('Conversation started!');
      onOpenChange(false);
      onConversationCreated();
    }
    
    setSearchTerm('');
    setUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {loading ? (
              <p className="text-center text-muted-foreground py-4">Searching...</p>
            ) : users.length === 0 ? (
              searchTerm && (
                <p className="text-center text-muted-foreground py-4">No users found</p>
              )
            ) : (
              users.map((targetUser) => (
                <div
                  key={targetUser.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={targetUser.avatar_url} />
                      <AvatarFallback>
                        {targetUser.display_name?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{targetUser.display_name || 'User'}</p>
                      <p className="text-sm text-muted-foreground">@{targetUser.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startConversation(targetUser)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    Message
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
