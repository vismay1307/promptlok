
\set ON_ERROR_STOP on

BEGIN;

DO $$
DECLARE
  v_suffix TEXT := replace(gen_random_uuid()::text, '-', '');

  v_user1 UUID;
  v_user2 UUID;

  v_prompt_a UUID;
  v_prompt_b UUID;

  v_version_a UUID;
  v_version_b UUID;

  v_request1 UUID;
  v_request2 UUID;
  v_request3 UUID;
  v_request4 UUID;
  v_request5 UUID;
  v_request6 UUID;

  v_response_other UUID;

  v_failed BOOLEAN;
BEGIN
  -- Create isolated test users
  INSERT INTO users (
    clerk_user_id, email, username, display_name
  ) VALUES (
    'req_test_' || v_suffix || '_1',
    'req_test_' || v_suffix || '_1@example.test',
    'reqtest_' || v_suffix || '_1',
    'REQ Test User 1'
  ) RETURNING id INTO v_user1;

  INSERT INTO users (
    clerk_user_id, email, username, display_name
  ) VALUES (
    'req_test_' || v_suffix || '_2',
    'req_test_' || v_suffix || '_2@example.test',
    'reqtest_' || v_suffix || '_2',
    'REQ Test User 2'
  ) RETURNING id INTO v_user2;

  -- Create two prompts and their versions
  INSERT INTO prompts (author_id, title)
  VALUES (v_user1, 'REQ Test Prompt A')
  RETURNING id INTO v_prompt_a;

  INSERT INTO prompts (author_id, title)
  VALUES (v_user2, 'REQ Test Prompt B')
  RETURNING id INTO v_prompt_b;

  INSERT INTO prompt_versions (
    prompt_id, version_number, content, editor_id
  ) VALUES (
    v_prompt_a, 1, 'REQ Test Content A', v_user1
  ) RETURNING id INTO v_version_a;

  INSERT INTO prompt_versions (
    prompt_id, version_number, content, editor_id
  ) VALUES (
    v_prompt_b, 1, 'REQ Test Content B', v_user2
  ) RETURNING id INTO v_version_b;

  -- Create six independent requests
  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 1', 'Test 1')
  RETURNING id INTO v_request1;

  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 2', 'Test 2')
  RETURNING id INTO v_request2;

  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 3', 'Test 3')
  RETURNING id INTO v_request3;

  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 4', 'Test 4')
  RETURNING id INTO v_request4;

  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 5', 'Test 5')
  RETURNING id INTO v_request5;

  INSERT INTO prompt_requests (requester_id, title, description)
  VALUES (v_user1, 'REQ Test 6', 'Test 6')
  RETURNING id INTO v_request6;

  -- TEST 1: Accepted request cannot have NULL accepted_response_id
  v_failed := FALSE;

  BEGIN
    INSERT INTO prompt_requests (
      requester_id, title, description, status
    ) VALUES (
      v_user1, 'Invalid Accepted Request',
      'Should fail', 'accepted'
    );
  EXCEPTION WHEN check_violation THEN
    v_failed := TRUE;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'TEST 1 FAILED: CHECK constraint was not enforced';
  END IF;

  RAISE NOTICE 'TEST 1 PASSED: Accepted request requires accepted_response_id';

  -- TEST 2: Only one active accepted response per request
  INSERT INTO prompt_request_responses (
    request_id, responder_id, prompt_id, prompt_version_id, is_accepted
  ) VALUES (
    v_request2, v_user1, v_prompt_a, v_version_a, TRUE
  );

  v_failed := FALSE;

  BEGIN
    INSERT INTO prompt_request_responses (
      request_id, responder_id, prompt_id, prompt_version_id, is_accepted
    ) VALUES (
      v_request2, v_user2, v_prompt_b, v_version_b, TRUE
    );
  EXCEPTION WHEN unique_violation THEN
    v_failed := TRUE;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Multiple accepted responses were allowed';
  END IF;

  RAISE NOTICE 'TEST 2 PASSED: Only one active accepted response allowed';

  -- TEST 3: Accepted response must belong to the same request
  INSERT INTO prompt_request_responses (
    request_id, responder_id, prompt_id, prompt_version_id
  ) VALUES (
    v_request4, v_user2, v_prompt_b, v_version_b
  ) RETURNING id INTO v_response_other;

  v_failed := FALSE;

  BEGIN
    UPDATE prompt_requests
    SET status = 'accepted',
        accepted_response_id = v_response_other
    WHERE id = v_request3;
  EXCEPTION WHEN foreign_key_violation THEN
    v_failed := TRUE;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Cross-request accepted response was allowed';
  END IF;

  RAISE NOTICE 'TEST 3 PASSED: Accepted response must belong to its request';

  -- TEST 4: Same user cannot submit duplicate active responses
  INSERT INTO prompt_request_responses (
    request_id, responder_id, prompt_id, prompt_version_id
  ) VALUES (
    v_request4, v_user1, v_prompt_a, v_version_a
  );

  v_failed := FALSE;

  BEGIN
    INSERT INTO prompt_request_responses (
      request_id, responder_id, prompt_id, prompt_version_id
    ) VALUES (
      v_request4, v_user1, v_prompt_a, v_version_a
    );
  EXCEPTION WHEN unique_violation THEN
    v_failed := TRUE;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'TEST 4 FAILED: Duplicate active response was allowed';
  END IF;

  RAISE NOTICE 'TEST 4 PASSED: Duplicate active responder blocked';

  -- TEST 5: Soft-deleted response allows a new response from same user
  INSERT INTO prompt_request_responses (
    request_id, responder_id, prompt_id, prompt_version_id
  ) VALUES (
    v_request5, v_user1, v_prompt_a, v_version_a
  );

  UPDATE prompt_request_responses
  SET deleted_at = NOW()
  WHERE request_id = v_request5
    AND responder_id = v_user1
    AND deleted_at IS NULL;

  INSERT INTO prompt_request_responses (
    request_id, responder_id, prompt_id, prompt_version_id
  ) VALUES (
    v_request5, v_user1, v_prompt_a, v_version_a
  );

  RAISE NOTICE 'TEST 5 PASSED: Soft-deleted response allows resubmission';

  -- TEST 6: Prompt A cannot reference Prompt B's version
  v_failed := FALSE;

  BEGIN
    INSERT INTO prompt_request_responses (
      request_id, responder_id, prompt_id, prompt_version_id
    ) VALUES (
      v_request6, v_user2, v_prompt_a, v_version_b
    );
  EXCEPTION WHEN foreign_key_violation THEN
    v_failed := TRUE;
  END;

  IF NOT v_failed THEN
    RAISE EXCEPTION 'TEST 6 FAILED: Mismatched prompt version was allowed';
  END IF;

  RAISE NOTICE 'TEST 6 PASSED: Prompt version must belong to the same prompt';

END $$;

ROLLBACK;
