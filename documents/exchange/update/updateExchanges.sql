--DELETE FROM blif_npa_exch_mtnc
--WHERE exch_abbrev = #{abbreviation};
        
Select * FROM BLIF_NPA_EXCH_MTNC
WHERE EXCH_ABBREV = 'test-71';

DELETE  FROM BLIF_NPA_EXCH_MTNC 
WHERE EXCH_ABBREV = 'test-71';