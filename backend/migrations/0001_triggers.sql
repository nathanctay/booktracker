-- update the date_finished column when the complete column is changed
CREATE FUNCTION update_completed_date() RETURNS trigger AS $update_completed_date$
    BEGIN
        IF NEW.complete IS TRUE AND OLD.complete IS NOT TRUE THEN
            NEW.date_finished := CURRENT_DATE;
        END IF;
        IF NEW.complete IS FALSE AND OLD.complete IS NOT FALSE THEN
            NEW.date_finished := NULL;
        END IF;
        RETURN NEW;
    END;
    $update_completed_date$ LANGUAGE plpgsql;

CREATE TRIGGER update_completed_date BEFORE UPDATE OF complete ON books
    FOR EACH ROW EXECUTE FUNCTION update_completed_date();

-- update the last_read column when the progress column is changed
CREATE FUNCTION update_last_read() RETURNS trigger AS $update_last_read$
    BEGIN
        IF NEW.progress > 0 AND OLD.progress = 0 THEN
            NEW.date_started := CURRENT_DATE;
        END IF;
        NEW.last_read := CURRENT_DATE;
        RETURN NEW;
    END;
    $update_last_read$ LANGUAGE plpgsql;

CREATE TRIGGER update_last_read BEFORE UPDATE OF progress ON books
    FOR EACH ROW EXECUTE FUNCTION update_last_read();