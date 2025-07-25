package com.demo.jwt.authify.services;

import com.demo.jwt.authify.constants.ErrorMessages;
import com.demo.jwt.authify.entity.TransportEntity;
import com.demo.jwt.authify.exceptions.AppExceptions;
import com.demo.jwt.authify.io.TransportRequest;
import com.demo.jwt.authify.repository.TransportRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransportServiceImpl implements TransportService{

    @PersistenceContext
    private final EntityManager entityManager;
    private final TransportRepository transportRepository;

    @Override
    public void addTransport(TransportRequest transportRequest) {
        TransportEntity transport = convertToTransportEntity(transportRequest);
        transportRepository.save(transport);
    }

    @Override
    public Page<TransportEntity> getAllTransports(int page, int size, String sortBy, String sortDir) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TransportEntity> query = cb.createQuery(TransportEntity.class);
        Root<TransportEntity> transport = query.from(TransportEntity.class);

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(transport.get(sortBy)));
        } else {
            query.orderBy(cb.desc(transport.get(sortBy)));
        }

        List<TransportEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        countQuery.select(cb.count(countQuery.from(TransportEntity.class)));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    @Override
    public Optional<TransportEntity> getTransport(Long id) {
        return transportRepository.findById(id);
    }

    @Override
    public void updateTransport(TransportRequest transportRequest, Long id) {
        TransportEntity existingTransport = transportRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.TransportNotFoundException(ErrorMessages.TRANSPORT_NOT_FOUND));

        BeanUtils.copyProperties(transportRequest, existingTransport, "transportId", "createdAt", "updatedAt");
        transportRepository.save(existingTransport);
    }

    @Override
    public void deleteTransport(Long id) {
        transportRepository.findById(id)
                .orElseThrow(() -> new AppExceptions.TransportNotFoundException(ErrorMessages.TRANSPORT_NOT_FOUND));
        transportRepository.deleteById(id);
    }

    @Override
    public Page<TransportEntity> searchTransports(String busNo, String routeNumber, String driverName, Long phoneNumber, int page, int size, String sortBy, String sortDir) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TransportEntity> query = cb.createQuery(TransportEntity.class);
        Root<TransportEntity> transport = query.from(TransportEntity.class);

        List<Predicate> predicates = buildPredicates(cb, transport, busNo, routeNumber, driverName, phoneNumber);
        query.where(cb.and(predicates.toArray(new Predicate[0])));

        if (sortDir.equalsIgnoreCase("asc")) {
            query.orderBy(cb.asc(transport.get(sortBy)));
        } else {
            query.orderBy(cb.desc(transport.get(sortBy)));
        }

        List<TransportEntity> resultList = entityManager.createQuery(query)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<TransportEntity> countRoot = countQuery.from(TransportEntity.class);

        List<Predicate> countPredicates = buildPredicates(cb, countRoot, busNo, routeNumber, driverName, phoneNumber);

        countQuery.select(cb.count(countRoot)).where(cb.and(countPredicates.toArray(new Predicate[0])));
        Long totalRecords = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, PageRequest.of(page, size), totalRecords);
    }

    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<TransportEntity> root,
                                            String busNo, String routeNumber, String driverName, Long phoneNumber) {
        List<Predicate> predicates = new ArrayList<>();

        if (busNo != null && !busNo.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("busNo")), "%" + busNo.toLowerCase() + "%"));
        }
        if (routeNumber != null && !routeNumber.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("routeNumber")), "%" + routeNumber.toLowerCase() + "%"));
        }
        if (driverName != null && !driverName.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("driverName")), "%" + driverName.toLowerCase() + "%"));
        }
        if (phoneNumber != null) {
            predicates.add(cb.like(
                    cb.function("str", String.class, root.get("phoneNumber")), "%" + phoneNumber + "%"
            ));
        }
        return predicates;
    }

    private TransportEntity convertToTransportEntity(TransportRequest transportRequest) {
        return TransportEntity.builder()
                .busNo(transportRequest.getBusNo())
                .driverName(transportRequest.getDriverName())
                .phoneNumber(transportRequest.getPhoneNumber())
                .licenseNumber(transportRequest.getLicenseNumber())
                .routeNumber(transportRequest.getRouteNumber())
                .build();
    }
}
