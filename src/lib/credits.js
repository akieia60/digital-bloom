import { supabase } from './supabase';
import { generateCreditCode } from '../utils/creditCode';

/**
 * Create a new experience credit
 * Called after successful Stripe payment for credit purchase
 */
export async function createExperienceCredit({
  amountCents,
  purchaserEmail,
  recipientEmail = null,
  stripeSessionId,
  notes = null
}) {
  try {
    // Generate unique code
    let code;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      code = generateCreditCode();
      const { data: existing } = await supabase
        .from('experience_credits')
        .select('id')
        .eq('code', code)
        .single();
      
      if (!existing) isUnique = true;
      attempts++;
    }
    
    if (!isUnique) {
      throw new Error('Failed to generate unique credit code');
    }

    // Insert credit
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .insert({
        code,
        initial_amount_cents: amountCents,
        remaining_amount_cents: amountCents,
        status: 'active',
        purchaser_email: purchaserEmail,
        recipient_email: recipientEmail,
        stripe_session_id: stripeSessionId,
        notes
      })
      .select()
      .single();

    if (creditError) throw creditError;

    // Insert ledger entry
    const { error: ledgerError } = await supabase
      .from('experience_credit_ledger')
      .insert({
        credit_id: credit.id,
        delta_cents: amountCents,
        reason: 'purchase'
      });

    if (ledgerError) throw ledgerError;

    return credit;
  } catch (error) {
    console.error('Error creating credit:', error);
    throw error;
  }
}

/**
 * Validate a credit code and return available balance
 */
export async function validateCreditCode(code) {
  try {
    const { data: credit, error } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !credit) {
      return { valid: false, error: 'Credit code not found' };
    }

    if (credit.status === 'void') {
      return { valid: false, error: 'This credit has been voided' };
    }

    if (credit.status === 'redeemed') {
      return { valid: false, error: 'This credit has already been fully redeemed' };
    }

    if (credit.remaining_amount_cents <= 0) {
      return { valid: false, error: 'This credit has no remaining balance' };
    }

    return {
      valid: true,
      credit_id: credit.id,
      code: credit.code,
      remaining_cents: credit.remaining_amount_cents,
      initial_cents: credit.initial_amount_cents,
      status: credit.status
    };
  } catch (error) {
    console.error('Error validating credit:', error);
    return { valid: false, error: 'Failed to validate credit code' };
  }
}

/**
 * Apply credit to an order
 * Returns the amount applied and updates credit balance
 */
export async function applyCreditToOrder({
  creditId,
  orderTotalCents,
  orderId
}) {
  try {
    // Get current credit
    const { data: credit, error: fetchError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('id', creditId)
      .single();

    if (fetchError || !credit) {
      throw new Error('Credit not found');
    }

    // Calculate amount to apply
    const appliedCents = Math.min(credit.remaining_amount_cents, orderTotalCents);
    const newBalance = credit.remaining_amount_cents - appliedCents;
    const newStatus = newBalance === 0 ? 'redeemed' : 'partially_used';

    // Update credit
    const { error: updateError } = await supabase
      .from('experience_credits')
      .update({
        remaining_amount_cents: newBalance,
        status: newStatus,
        redeemed_at: newStatus === 'redeemed' ? new Date().toISOString() : null
      })
      .eq('id', creditId);

    if (updateError) throw updateError;

    // Insert ledger entry
    const { error: ledgerError } = await supabase
      .from('experience_credit_ledger')
      .insert({
        credit_id: creditId,
        delta_cents: -appliedCents,
        reason: 'redemption',
        related_order_id: orderId
      });

    if (ledgerError) throw ledgerError;

    return {
      applied_cents: appliedCents,
      remaining_cents: newBalance,
      new_status: newStatus
    };
  } catch (error) {
    console.error('Error applying credit:', error);
    throw error;
  }
}

/**
 * Get credit balance and history
 */
export async function getCreditBalance(code) {
  try {
    const { data: credit, error: creditError } = await supabase
      .from('experience_credits')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (creditError || !credit) {
      throw new Error('Credit code not found');
    }

    // Get ledger history
    const { data: history, error: historyError } = await supabase
      .from('experience_credit_ledger')
      .select('*')
      .eq('credit_id', credit.id)
      .order('created_at', { ascending: false });

    if (historyError) throw historyError;

    return {
      ...credit,
      history: history || []
    };
  } catch (error) {
    console.error('Error getting credit balance:', error);
    throw error;
  }
}
