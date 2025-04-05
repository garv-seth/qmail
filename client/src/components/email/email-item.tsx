import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Lightbulb, 
  Bot,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Email } from '@/types/email';
import { useUpdateEmail } from '@/hooks/use-emails';
import { formatDistanceToNow } from 'date-fns';

interface EmailItemProps {
  email: Email;
}

export default function EmailItem({ email }: EmailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: updateEmail } = useUpdateEmail();
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    
    // Mark as read if expanding and not already read
    if (!isExpanded && !email.isRead) {
      updateEmail({
        id: email.id,
        data: { isRead: true }
      });
    }
  };
  
  const handleUnsubscribe = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement unsubscribe functionality
    console.log('Unsubscribe from:', email.from);
  };
  
  const toggleFlagged = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateEmail({
      id: email.id,
      data: { isFlagged: !email.isFlagged }
    });
  };
  
  // Extract key info from the email
  const getDisplayName = () => {
    // Simple extraction of display name from email format "Name <email@example.com>"
    const match = email.from.match(/^"?([^"<]+)"?\s*<.*>$/);
    if (match) return match[1].trim();
    
    // If no display name format, use the part before @ in the email
    const emailMatch = email.from.match(/^([^@]+)@.+$/);
    if (emailMatch) return emailMatch[1];
    
    return email.from;
  };
  
  const getEmailAddress = () => {
    const match = email.from.match(/<([^>]+)>$/);
    if (match) return match[1];
    
    if (email.from.includes('@')) return email.from;
    
    return '';
  };
  
  const getRelativeTime = () => {
    if (!email.receivedAt) return '';
    return formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true });
  };
  
  const isScam = email.aiAnalysis && (email.aiAnalysis as any).isScam;
  const scamProbability = email.aiAnalysis ? (email.aiAnalysis as any).scamProbability || 0 : 0;
  const unsubscribeRecommended = email.aiAnalysis && (email.aiAnalysis as any).unsubscribeRecommended;
  const isEncrypted = email.folder === 'sent'; // Simplification - all sent emails are encrypted

  // Get first letter for avatar
  const getFirstLetter = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };
  
  // Random background color based on sender name
  const getAvatarColor = () => {
    const name = getDisplayName();
    const colors = [
      'bg-purple-500', 'bg-blue-500', 'bg-green-500', 
      'bg-amber-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };
  
  return (
    <div 
      className={cn(
        "bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow transition-all",
        !email.isRead && "bg-primary/5 dark:bg-primary/10",
        "overflow-hidden"
      )}
      onClick={toggleExpanded}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Sender Avatar */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
            getAvatarColor()
          )}>
            {getFirstLetter()}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <span className={cn(
                  "font-semibold block",
                  email.isRead ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-900 dark:text-white"
                )}>
                  {getDisplayName()}
                </span>
                
                <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="truncate">{getRelativeTime()}</span>
                  
                  {isScam || scamProbability > 0.7 ? (
                    <span title="Suspicious sender">
                      <AlertTriangle className="ml-2 h-3.5 w-3.5 text-amber-500" />
                    </span>
                  ) : (
                    <span title="Verified sender">
                      <CheckCircle className="ml-2 h-3.5 w-3.5 text-green-500" />
                    </span>
                  )}
                </div>
              </div>
              
              {/* Star/Flag button */}
              <button 
                onClick={toggleFlagged}
                className={cn(
                  "text-neutral-400 hover:text-amber-400",
                  email.isFlagged && "text-amber-400"
                )}
              >
                <Star className="h-5 w-5" />
                <span className="sr-only">Flag email</span>
              </button>
            </div>
            
            <h3 className={cn(
              "font-medium mt-1",
              email.isRead ? "text-neutral-700 dark:text-neutral-300" : "text-neutral-900 dark:text-white"
            )}>
              {email.subject}
            </h3>
            
            <p className={cn(
              "text-sm line-clamp-2 mt-1",
              email.isRead ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-600 dark:text-neutral-300"
            )}>
              {email.body}
            </p>
            
            {/* Email badges */}
            {(isEncrypted || isScam || unsubscribeRecommended) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {isEncrypted && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                    <Lock className="h-3 w-3 mr-1" /> Encrypted
                  </Badge>
                )}
              </div>
            )}
            
            {/* AI Warning Banner for Scams */}
            {isExpanded && (isScam || scamProbability > 0.7) && (
              <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                <div className="flex items-center">
                  <Bot className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-amber-600 dark:text-amber-400">AI Detection: Potential phishing attempt</p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {email.aiAnalysis && (email.aiAnalysis as any).reasons ? 
                        (email.aiAnalysis as any).reasons.join('. ') : 
                        'This email contains suspicious elements.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Suggestion Banner for Unsubscribe */}
            {isExpanded && unsubscribeRecommended && (
              <div className="mt-3 bg-primary/5 border border-primary/10 rounded-lg p-2">
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-primary">AI Suggestion: Low engagement detected</p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {email.aiAnalysis && (email.aiAnalysis as any).unsubscribeReason ? 
                        (email.aiAnalysis as any).unsubscribeReason : 
                        "You haven't interacted with emails from this sender recently."
                      }
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="ml-2 text-xs"
                    onClick={handleUnsubscribe}
                  >
                    Unsubscribe
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
